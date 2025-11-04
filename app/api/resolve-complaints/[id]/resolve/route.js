import { NextResponse } from "next/server";
// Import database connection and model
import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/Task";

/**
 * Handles the PATCH request to resolve a complaint by its ID.
 * @param {Request} req The incoming request object.
 * @param {Object} context The context object containing route parameters.
 * @returns {NextResponse} The JSON response indicating success or failure.
 */
export async function PATCH(req, context) {
    // FIX: Access 'params' directly from the 'context' object. 
    // The context object is passed synchronously and should NOT be awaited.
    const { params } = context; 

    // Ensure database connection is established
    await connects();

    try {
        // Destructure the 'id' from the now-synchronous 'params' object
        const { id } = params;

        // Update the task status to "Resolved"
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { status: "Resolved" },
          { new: true } // Return the updated document
        );

        // Handle case where the document ID is valid but not found
        if (!updatedTask) {
          return NextResponse.json(
            { success: false, message: "Complaint not found" },
            { status: 404 }
          );
        }

        // Return successful response
        return NextResponse.json({
          success: true,
          message: "Complaint marked as resolved successfully",
          task: updatedTask,
        });
    } catch (error) {
        console.error("Error resolving complaint:", error);
        // Return a 500 status for database or other server errors
        return NextResponse.json(
          { success: false, message: "Failed to update complaint status" },
          { status: 500 }
        );
    }
}
