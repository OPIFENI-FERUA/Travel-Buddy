import { neon } from "@neondatabase/serverless";

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

    // Get balance directly from users table
    const result = await sql`
      SELECT balance 
      FROM users 
      WHERE clerk_id = ${clerkId}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true,
      balance: result[0].balance || 0
    });

  } catch (error) {
    console.error("Error fetching balance:", error);
    return Response.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
} 