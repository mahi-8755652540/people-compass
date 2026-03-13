import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const allowedOrigins = [
  'https://ssscore.lovable.app',
  'https://id-preview--21ca6b65-15f1-4d0a-a47d-54bd532d66a2.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized - No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with the user's JWT to verify their identity
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    // Extract the token from the Authorization header
    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // CRITICAL: Pass the token explicitly for validation (required for Lovable Cloud ES256 signing)
    const { data: { user: callingUser }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !callingUser) {
      console.error("Auth verification failed:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Request from authenticated user:", callingUser.id);

    // SECURITY: Verify the caller has admin or HR role
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callingUser.id)
      .single();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Could not verify role" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only admin and HR can create users
    if (!["admin", "hr"].includes(roleData.role)) {
      console.error("User role not authorized:", roleData.role);
      return new Response(
        JSON.stringify({ error: "Forbidden - Only admin and HR can create users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Caller authorized with role:", roleData.role);

    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      designation, 
      department,
      fatherName,
      motherName,
      salary,
      salaryDetails,
      workType,
      presentAddress,
      permanentAddress,
      bankDetails,
      avatarUrl
    } = await req.json();

    console.log("Creating user with email:", email, "role:", role);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate role
    const validRoles = ["admin", "hr", "staff", "contractor"];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be: admin, hr, staff, or contractor" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Only admin can create admin users
    if (role === "admin" && roleData.role !== "admin") {
      console.error("Non-admin trying to create admin user");
      return new Response(
        JSON.stringify({ error: "Forbidden - Only admin can create admin users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user using admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User created:", authData.user?.id);

    // Update user role (trigger creates default 'staff' role, we need to update it)
    if (role !== "staff" && authData.user) {
      const { error: roleUpdateError } = await supabaseAdmin
        .from("user_roles")
        .update({ role })
        .eq("user_id", authData.user.id);

      if (roleUpdateError) {
        console.error("Role update error:", roleUpdateError);
      } else {
        console.log("Role updated to:", role);
      }
    }

    // Update profile with all employee details
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          phone: phone || null,
          designation: designation || null,
          department: department || null,
          father_name: fatherName || null,
          mother_name: motherName || null,
          salary: salary || null,
          salary_details: salaryDetails || null,
          work_type: workType || 'office',
          present_address: presentAddress || null,
          permanent_address: permanentAddress || null,
          bank_details: bankDetails || null,
          avatar_url: avatarUrl || null,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      } else {
        console.log("Profile updated with employee details");
      }
    }

    console.log("User creation completed successfully by:", callingUser.email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${email} created with role: ${role}`,
        user_id: authData.user?.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
