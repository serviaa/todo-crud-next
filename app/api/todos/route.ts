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

// POST tambah todo baru
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

// PUT update status done activity
export async function PUT(req: Request) {
  const { id, done } = await req.json();
  await pool.query(`UPDATE activities SET done=$1 WHERE id=$2`, [done, id]);
  return NextResponse.json({ success: true });
}

// DELETE hapus todo (otomatis hapus activities via CASCADE)
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
