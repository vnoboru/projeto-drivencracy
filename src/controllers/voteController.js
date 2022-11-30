import { ObjectId } from "mongodb";
import { choiceColl, pollsColl, voteColl } from "../../index.js";
import dayjs from "dayjs";

export async function postVote(req, res) {
  const id = req.params.id;
  const createDate = dayjs().format("YYYY-MM-DD HH:mm");

  try {
    const optionExist = await choiceColl.findOne({ _id: ObjectId(id) });

    if (!optionExist) {
      return res.status(404).send("Esse id de opção não existe. ");
    }

    const poll = await pollsColl.findOne({ _id: ObjectId(optionExist.pollId) });

    if (dayjs(poll.expireAt).valueOf() < Date.now()) {
      return res.status(403).send("Data da enquete está expirada. ");
    }

    const data = await voteColl.insertOne({
      createdAt: createDate,
      choiceId: ObjectId(id),
    });
    console.log(data);
    return res.status(201).send("Voto enviado com sucesso! ");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Não foi possível fazer o voto. ");
  }
}
