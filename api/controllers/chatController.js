const Group = require("../../Shema/Group");
const Message = require("../../Shema/Message");
const Participant = require("../../Shema/Participant");
const { getUserIdAfterVerifyToken } = require("../../utils/utils");

const createGroup = async (req, res) => {
  try {
    const { label } = req.body;
    const user = await getUserIdAfterVerifyToken(req);
    const userId = user._id;
    const existingGroup = await Group.findOne({ label, owner: userId });

    if (existingGroup) {
      return res.status(400).json({ error: "Group name must be unique" });
    }
    const newGroup = await new Group({ label, owner: userId }).save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getListGroup = async (req, res) => {
  try {
    const user = await getUserIdAfterVerifyToken(req);
    const userId = user._id;
    const groupList = await Group.find({});
    const groupParticipation = await Promise.all(
      groupList.map(async (group) => {
        const isParticipant = await Participant.find({
          user_id: userId,
          group_id: group._id,
        });

        return {
          _id: group._id,
          label: group.label,
          owner: group.owner,
          participant_id:
            isParticipant?.length > 0 ? isParticipant[0]?._id : null,
        };
      })
    );

    res.status(200).json(groupParticipation);
  } catch {
    res.status(500).json({ error });
  }
};
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(id);

    res.status(200).json("The group is deleted successfully.");
  } catch {
    res.status(500).json({ error });
  }
};
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const user = await getUserIdAfterVerifyToken(req);
    const userId = user._id;
    const existingJoinGroup = await Participant.findOne({
      group_id: groupId,
      user_id: userId,
    });

    if (existingJoinGroup) {
      return res
        .status(400)
        .json({ error: "You are arredy  join to  this group" });
    }
    const newParticipant = await new Participant({
      group_id: groupId,
      user_id: userId,
    }).save();
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPaticipantGroup = await Participant.findByIdAndDelete(id);

    res.status(200).json("You  are leave The group  successfully.");
  } catch {
    res.status(500).json({ error });
  }
};

const getlistMessageByGroupId = async (req, res) => {
  try {
    const { id } = req.params;
    const getListOfMessage = await Message.find({ group_id: id });

    res.status(200).json(getListOfMessage);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const sendMessageInGroup = async (req, res) => {
  try {
    const data = req.body;

    const createMessage = await new Message(data);
    createMessage.save();
    res.status(200).json(createMessage);
  } catch (error) {
    res.status(500).json({ error });
  }
};
module.exports = {
  createGroup,
  getListGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getlistMessageByGroupId,
  sendMessageInGroup,
};
