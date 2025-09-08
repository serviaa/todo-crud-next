import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET semua todo + activities
export async function GET() {
  const result = await pool.query(`
    SELECT t.id, t.title, t.deskripsi, t.created_at,
           COALESCE(json_agg(json_build_object(
             'id', a.id,
             'time', a.time,
             'activity', a.activity,
             'done', a.done
           )) FILTER (WHERE a.id IS NOT NULL), '[]') AS activities
    FROM todos t
    LEFT JOIN activities a ON t.id = a.todo_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
  return NextResponse.json(result.rows);
}

// CREATE todo
export async function POST(req: Request) {
  const { title, deskripsi, activities } = await req.json();

  const inserted = await pool.query(
    `INSERT INTO todos (title, deskripsi)
     VALUES ($1, $2)
     RETURNING id`,
    [title, deskripsi || null]
  );

  const todoId = inserted.rows[0].id;

  if (activities?.length) {
    for (const act of activities) {
      await pool.query(
        `INSERT INTO activities (todo_id, time, activity, done)
         VALUES ($1, $2, $3, false)`,
        [todoId, act.time, act.activity]
      );
    }
  }

  return NextResponse.json({ success: true, id: todoId }, { status: 201 });
}

// UPDATE todo / activity
export async function PUT(req: Request) {
  const { type, id, title, deskripsi, time, activity, done } = await req.json();

  if (type === "todo") {
    await pool.query(
      `UPDATE todos SET title = $1, deskripsi = $2 WHERE id = $3`,
      [title, deskripsi || null, id]
    );
  }

  if (type === "activity") {
    await pool.query(
      `UPDATE activities SET time = $1, activity = $2, done = $3 WHERE id = $4`,
      [time, activity, done, id]
    );
  }

  return NextResponse.json({ success: true });
}

// DELETE todo / activity
export async function DELETE(req: Request) {
  const { type, id } = await req.json();

  if (type === "todo") {
    await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
  }

  if (type === "activity") {
    await pool.query(`DELETE FROM activities WHERE id = $1`, [id]);
  }

  return NextResponse.json({ success: true });
}
