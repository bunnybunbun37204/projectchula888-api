# Student API

## Description

This API allows you to perform CRUD operations on student data.

## Base URL

The base URL for this API is `/student`.

## Endpoints

### GET /count

- Description: Get the total number of students.
- Response: JSON object containing the count.

### GET /:id

- Description: Get a student by ID.
- Parameters:
  - `id`: The ID of the student.
- Response: JSON object containing the student data.

### GET /

- Description: Get all students.
- Response: JSON array containing all student data.

### POST /

- Description: Create a new student.
- Request Body: JSON object containing student data (name, email, major).
- Response: JSON object confirming the creation.

### PATCH /

- Description: Update a student.
- Request Body: JSON object containing updated student data (name, email, major).
- Response: JSON object confirming the update.

### DELETE /

- Description: Delete a student.
- Request Body: JSON object containing the ID of the student to delete.
- Response: JSON object confirming the deletion.
