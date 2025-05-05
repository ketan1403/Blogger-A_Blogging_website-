import { connectDB } from "@/app/lib/config/db";
import { writeFile } from "fs/promises";
import { console } from "inspector";
export const runtime = "nodejs";
const { NextResponse } = require("next/server");
import BlogModel from "@/app/lib/models/blogmodel";
const fs = require("fs");

const Loaddb = async () => {
  await connectDB();
};

Loaddb();

export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json({ blog });
  } else {
    const blogs = await BlogModel.find();
    return NextResponse.json({ blogs });
  }
}

export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();
  const image = formData.get("image");
  if (!image) {
    return NextResponse.json(
      {
        success: false,
        msg: "No image file uploaded",
      },
      { status: 400 }
    );
  }
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get("title")}`,
    description: `${formData.get("description")}`,
    category: `${formData.get("category")}`,
    author: `${formData.get("author")}`,
    image: `${imgUrl}`,
    authorImg: `${formData.get("authorImg")}`,
  };

  await BlogModel.create(blogData);
  console.log("Blog Saved");

  return NextResponse.json({
    success: true,
    msg: "Blog Added",
  });
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({
    msg: "Blog Deleted",
  });
}
