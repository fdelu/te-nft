import { NextApiRequest, NextApiResponse } from "next";

const IMAGE_URL = "https://picsum.photos/1280/720";

type Data = {
  name: string;
  description: string;
  image: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  res.status(200).json({
    name: `Ticket ${id}`,
    description: `Entrada a evento`,
    image: IMAGE_URL,
  });
}
