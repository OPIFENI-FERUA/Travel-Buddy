import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const clerkId = url.searchParams.get('clerkId');

    if (!clerkId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing clerkId parameter' 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Initialize database connection
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Fetch user profile
    const result = await sql`
      SELECT * FROM profiles 
      WHERE clerk_id = ${clerkId}
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          profile: null 
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        profile: result[0]
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to fetch profile' 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const kin = formData.get('kin') as string;
    const gender = formData.get('gender') as string;
    const nin = formData.get('nin') as string;
    const clerkId = formData.get('clerkId') as string;
    const profileImage = formData.get('profileImage') as File;

    // Validate required fields
    if (!name || !email || !mobile || !kin || !gender || !nin || !clerkId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields' 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Initialize database connection
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Check if user exists
      const existingUser = await sql`
        SELECT * FROM profiles 
        WHERE clerk_id = ${clerkId}
      `;

      let imageUrl = null;
      if (profileImage) {
        imageUrl = profileImage.name;
      }

      let result;
      if (existingUser.length > 0) {
        // Update existing user
        result = await sql`
          UPDATE profiles 
          SET 
            name = ${name},
            email = ${email},
            mobile = ${mobile},
            kin = ${kin},
            gender = ${gender},
            nin = ${nin},
            image_url = ${imageUrl},
            updated_at = NOW()
          WHERE clerk_id = ${clerkId}
          RETURNING *
        `;
      } else {
        // Insert new user
        result = await sql`
          INSERT INTO profiles (
            name,
            email,
            mobile,
            kin,
            gender,
            nin,
            clerk_id,
            image_url
          ) 
          VALUES (
            ${name}, 
            ${email},
            ${mobile},
            ${kin},
            ${gender},
            ${nin},
            ${clerkId},
            ${imageUrl}
          )
          RETURNING *
        `;
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: existingUser.length > 0 ? 'Profile updated successfully' : 'Profile created successfully',
          profile: result[0]
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

    } catch (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Database operation failed' 
        }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to process request' 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}                                                                                                                                                                                                                                   