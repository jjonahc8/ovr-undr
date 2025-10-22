import { createClient as createServerClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("=== Mailing list API called ===");
  try {
    const { email } = await request.json();
    console.log("Received email:", email);

    if (!email || typeof email !== "string") {
      console.log("Email validation failed: missing or invalid type");
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Email validation failed: invalid format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create a Supabase client with anon key (no auth required)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
    );
    console.log("Supabase client created");

    // Insert email into mailing_list table
    console.log("Attempting to insert email into database...");
    const { data, error } = await supabase
      .from("mailing_list")
      .insert([{ email: email.toLowerCase().trim() }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);

      // Check if error is due to duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to subscribe", details: error.message },
        { status: 500 }
      );
    }

    console.log("Successfully inserted email:", data);
    return NextResponse.json(
      { message: "Successfully subscribed!", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in mailing list API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
