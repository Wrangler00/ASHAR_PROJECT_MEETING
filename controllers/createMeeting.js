const moment = require('moment');
const format = require('pg-format');

const RSVP_ENUM = ['yes', 'no', 'maybe', 'not answered'];
const MEETING_QUERY = 'INSERT INTO meetings("title" ,"startTime","endTime") VALUES($1, $2, $3) RETURNING *';
const PARTICIPANTS_QUERY = 'INSERT INTO participants("name" ,"email","meeting_id","rsvp") VALUES %L RETURNING *';
const DATEFORMAT = process.env.DATEFORMAT || 'YYYY-DD-MM';
const jsonFormat = d => d.rows;

module.exports = async (req, res) => {
    try {
        const { title, participants, startTime, endTime } = req.body;

        //validation //understand this ?
        if (!title ||
            !participants.every(i => RSVP_ENUM.includes(i.rsvp.toLowerCase())) ||
            !moment(startTime, DATEFORMAT).isValid() ||
            !moment(endTime, DATEFORMAT).isValid()) {
            return res.send({
                success: false
            })
        }

        //format date to proper format
        let start = moment(startTime, DATEFORMAT).format("MM/DD/YYYY");
        let end = moment(endTime, DATEFORMAT).format("MM/DD/YYYY");

        //insert into meeting
        const meetings = jsonFormat(await db.query(MEETING_QUERY, [title, start, end]));
        const id = meetings[0].id;

        const participants_values = participants.map(i => [i.name, i.email, id, i.rsvp.toLowerCase()]);

        //insert into participants
        const participants_members = jsonFormat(await db.query(format(PARTICIPANTS_QUERY, participants_values)));

        //attach particpants into response object that is to be send
        let response = meetings[0];
        response.participants = participants_members;

        //send json
        res.json({ meetings: response });
    } catch (err) {

        //send error if any error
        console.error(err);
        res.send({
            success: false,
            msg: "Internal server error"
        })
    }
}