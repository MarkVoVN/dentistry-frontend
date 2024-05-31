import { NextRequest, NextResponse } from "next/server";

let mockData = [
  { id: 0, title: "Cook" },
  { id: 1, title: "Clean" },
];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      data: mockData,
      status: 200,
      message: "Success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Tên đăng nhập và mật khẩu không hợp lệ" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title } = body;

    if (!title) {
      throw new Error("Title is required");
    }

    mockData.push({ id, title });

    return NextResponse.json({
      data: mockData,
      status: 200,
      message: "Success",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.message ||
          "An unexpected error occured. Please try again later.",
      },
      { status: 400 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { username, password } = body;

//   const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
//   const refreshSecret = process.env.NEXT_PUBLIC_ADMIN_REFRESH_SECRET;

//   if (
//     username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
//     password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD &&
//     secret &&
//     refreshSecret
//   ) {
//     const accessToken = "accessTokenSerialized";

//     return NextResponse.json({ accessToken });
//   } else {
//     return NextResponse.json(
//       { message: "Tên đăng nhập và mật khẩu không hợp lệ" },
//       { status: 401 }
//     );
//   }
// }
