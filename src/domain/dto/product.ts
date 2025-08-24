import { z } from "zod";

const CreateProductDTO = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  stock: z.number(),
  price: z.number().nonnegative(),
  stripePriceId: z.string().min(1),
  color_id: z.string().min(1),
  description: z.string().min(1)
});

export { CreateProductDTO };
