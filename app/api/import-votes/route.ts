import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET(): Promise<Response> {
  return await new Promise<Response>((resolve) => {
    exec(
      "npx tsx scripts/import-votes.ts",
      (error, stdout, stderr) => {
        if (error) {
          resolve(
            NextResponse.json(
              {
                success: false,
                error: error.message,
              },
              { status: 500 }
            )
          );
          return;
        }

        resolve(
          NextResponse.json({
            success: true,
            stdout,
            stderr,
          })
        );
      }
    );
  });
}