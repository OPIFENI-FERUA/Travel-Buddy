import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from 'uuid';

// Create bookings table if it doesn't exist
const createBookingsTable = async (sql: any) => {
  try {
    // First check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'bookings'
      );
    `;

    if (!tableExists[0].exists) {
      console.log("Creating bookings table...");
      await sql`
        CREATE TABLE bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          clerk_id TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          sender_location TEXT NOT NULL,
          sender_mobile TEXT NOT NULL,
          sender_estate TEXT,
          sender_street TEXT,
          receiver_name TEXT NOT NULL,
          receiver_location TEXT NOT NULL,
          receiver_mobile TEXT NOT NULL,
          receiver_estate TEXT,
          receiver_street TEXT,
          package_type TEXT NOT NULL,
          is_fragile BOOLEAN DEFAULT false,
          is_tracking BOOLEAN DEFAULT false,
          description TEXT,
          weight DECIMAL(10,2) NOT NULL,
          image_url TEXT,
          delivery_mean TEXT,
          amount DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'draft'))
        );
      `;
      console.log("Bookings table created successfully");
    } else {
      // Check the current table structure
      const tableInfo = await sql`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        ORDER BY ordinal_position;
      `;
      console.log("Current table structure:", tableInfo);
    }
  } catch (error) {
    console.error("Error checking/creating bookings table:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await createBookingsTable(sql);
    const payload = await request.json();

    // Validate required fields
    const requiredFields = [
      'sender_name', 'sender_location', 'sender_mobile',
      'receiver_name', 'receiver_location', 'receiver_mobile',
      'selected_type', 'weight', 'clerk_id'
    ];
    
    const missingFields = requiredFields.filter(field => !payload[field]);
    if (missingFields.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert weight to number
    const numericWeight = parseFloat(payload.weight);
    if (isNaN(numericWeight)) {
      return Response.json(
        { error: "Weight must be a valid number" },
        { status: 400 }
      );
    }

    // Generate UUID for the booking
    const bookingId = uuidv4();
    console.log("Generated booking UUID:", bookingId);

    // Insert into database
    const response = await sql`
      INSERT INTO bookings (
        id,
        clerk_id,
        sender_name,
        sender_location,
        sender_mobile,
        sender_estate,
        sender_street,
        receiver_name,
        receiver_location,
        receiver_mobile,
        receiver_estate,
        receiver_street,
        package_type,
        is_fragile,
        is_tracking,
        description,
        weight,
        image_url,
        delivery_mean,
        amount
      ) VALUES (
        ${bookingId},
        ${payload.clerk_id},
        ${payload.sender_name},
        ${payload.sender_location},
        ${payload.sender_mobile},
        ${payload.sender_estate || null},
        ${payload.sender_street || null},
        ${payload.receiver_name},
        ${payload.receiver_location},
        ${payload.receiver_mobile},
        ${payload.receiver_estate || null},
        ${payload.receiver_street || null},
        ${payload.selected_type},
        ${payload.is_fragile || false},
        ${payload.is_tracking || false},
        ${payload.description || null},
         ${numericWeight},
        ${payload.image_url || null},
        ${payload.delivery_mean || null},
        ${payload.amount || 0}
      )
      RETURNING id;
    `;

    console.log("Database response:", response);
    console.log("Returned booking ID:", response[0]?.id);

    return Response.json({ 
      success: true, 
      data: response, 
      bookingId: response[0]?.id
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating shipment:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

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

    // Fetch user's bookings
    const result = await sql`
      SELECT 
        id,
        sender_name,
        sender_location,
        sender_mobile,
        receiver_name,
        receiver_location,
        receiver_mobile,
        package_type,
        status,
        created_at,
        weight,
        delivery_mean,
        amount
      FROM bookings 
      WHERE clerk_id = ${clerkId}
      ORDER BY created_at DESC
    `;

    return Response.json({ 
      success: true,
      bookings: result 
    });

  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { bookingId, status } = await request.json();

    console.log("Updating booking:", { bookingId, status });

    if (!bookingId || !status) {
      console.log("Missing fields:", { bookingId, status });
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update booking status
    const response = await sql`
      UPDATE bookings 
      SET status = ${status}
      WHERE id = ${bookingId}
      RETURNING id, status;
    `;

    console.log("Update response:", response);

    if (!response || response.length === 0) {
      console.log("No booking found with ID:", bookingId);
      return Response.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true,
      data: response[0]
    });

  } catch (error: any) {
    console.error("Error updating booking:", error);
    return Response.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
