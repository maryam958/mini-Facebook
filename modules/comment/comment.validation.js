import joi from "joi";



export const addCommentSchema = {
    body: joi
      .object()
      .required()
      .keys({
        content: joi
          .string()
      }),
  };