import { neon } from "@neondatabase/serverless";

// Create transactions table if it doesn't exist
const createTransactionsTable = async (sql: any) => {
  try {
    // First check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'transactions'
      );
    `;

    if (!tableExists[0].exists) {
      console.log("Creating transactions table...");
      await sql`
        CREATE TABLE transactions (
          transaction_id SERIAL PRIMARY KEY,
          clerk_id TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          provider TEXT,
          transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'profit')),
          description TEXT,
          phone_number TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log("Transactions table created successfully");
    } else {
      console.log("Transactions table already exists");
    }
  } catch (error) {
    console.error("Error checking/creating transactions table:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const clerkId = url.searchParams.get('clerkId');

    if (!clerkId) {
      return Response.json(
        { error: "Missing clerkId parameter" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    await createTransactionsTable(sql);

    // Fetch recent transactions
    const result = await sql`
      SELECT 
        transaction_id,
        amount,
        provider,
        transaction_type,
        description,
        phone_number,
        created_at
      FROM transactions 
      WHERE clerk_id = ${clerkId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return Response.json({ 
      success: true,
      transactions: result
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await createTransactionsTable(sql);

    const {
      clerkId,
      amount,
      provider,
      transactionType,
      description,
      phoneNumber,
    } = await request.json();

    console.log("Processing transaction:", {
      clerkId,
      amount,
      provider,
      transactionType,
      description,
      phoneNumber
    });

    // Validate required fields
    if (!clerkId || !amount || !transactionType) {
      console.log("Missing required fields:", { clerkId, amount, transactionType });
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check valid transaction type
    if (!["credit", "debit", "profit"].includes(transactionType)) {
      console.log("Invalid transaction type:", transactionType);
      return Response.json(
        { success: false, error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log("Invalid amount:", amount);
      return Response.json(
        { success: false, error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    try {
      console.log("Attempting database insert with values:", {
        clerkId,
        numericAmount,
        provider,
        transactionType,
        description,
        phoneNumber
      });

      const response = await sql`
        INSERT INTO transactions (
          clerk_id,
          amount,
          provider,
          transaction_type,
          description,
          phone_number,
          created_at
        ) VALUES (
          ${clerkId},
          ${numericAmount},
          ${provider ?? null},
          ${transactionType},
          ${description ?? null},
          ${phoneNumber ?? null},
          NOW()
        )
        RETURNING transaction_id, amount, transaction_type;
      `;

      console.log("Database response:", response);

      if (!response || response.length === 0) {
        console.log("Failed to insert transaction - no response from database");
        return Response.json(
          { success: false, error: "Failed to record transaction" },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: "Transaction recorded successfully",
        data: response[0]
      });

    } catch (dbError: any) {
      console.error("Database error:", {
        error: dbError.message,
        code: dbError.code,
        detail: dbError.detail
      });
      return Response.json(
        { 
          success: false, 
          error: "Database error: " + (dbError.detail || dbError.message)
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Error creating transaction:", {
      error: error.message,
      stack: error.stack
    });
    return Response.json(
      { success: false, error: error.message || "Failed to process transaction" },
      { status: 500 }
    );
  }
}
