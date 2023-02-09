import {Router} from 'express'
import { addComment, deleteComment } from './controller/comment.controller.js';
import { auth } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import { addCommentSchema } from './comment.validation.js';
const router=Router();

router.post('/:postId/addComment',auth(),validation(addCommentSchema),addComment)

router.delete('/:postId/:commentId/deleteComment',auth(),deleteComment)


export default router;