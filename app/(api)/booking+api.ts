import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
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

    // Ensure image is a valid URL or file path (if applicable)
    let image = payload.image;
    if (image && typeof image === "string" && !image.startsWith("http")) {
      // Handle as file URI or base64, maybe store it properly in a file storage system
      image = null; // Or a placeholder image URL if you're storing images elsewhere
    }

    // Insert into database
    const response = await sql`
      INSERT INTO bookings (
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
        delivery_mean
      ) VALUES (
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
        ${payload.image?.uri || null},
        ${payload.delivery_mean || null}
      );
    `;

    // Assuming response from DB has the inserted data, respond accordingly
    return Response.json({ 
      success: true, 
      data: response, 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating shipment:", error);
    
    // Send a more specific error response depending on the error type
    const errorMessage = error.message || "Internal Server Error";
    console.log(Response.json);
    
    return Response.json(
      { error: errorMessage }, 
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
        receiver_name,
        receiver_location,
        package_type,
        status,
        created_at,
        weight,
        delivery_mean
      FROM bookings 
      WHERE clerk_id = ${clerkId}
      ORDER BY created_at DESC
    `;

    return Response.json({ 
      success: true,
      bookings: result 
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
