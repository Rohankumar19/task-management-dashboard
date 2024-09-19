import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Task from '../../../models/Task';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const task = await Task.findOne({ _id: id, user: session.user.id });
        if (!task) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const task = await Task.findOneAndUpdate(
          { _id: id, user: session.user.id },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!task) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE':
      try {
        const deletedTask = await Task.deleteOne({ _id: id, user: session.user.id });
        if (!deletedTask) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}