const moment = require('moment');
const DATEFORMAT = process.env.DATEFORMAT || 'YYYY-DD-MM';

const getQuery = (start, end, offset, limit=50) =>
    `select
        m.id,
        m.title ,
        m."startTime" ,
        m."endTime" ,
        m.created_at ,
    jsonb_agg(jsonb_build_object('name',p.name,'email',p.email,'rsvp',p.rsvp)) as participants
    from meetings m 
    inner join participants p on m.id = p.meeting_id 
    where m."startTime">='${start}' and m."endTime"<='${end}'
    group by
        m.id,
        m.title ,
        m."startTime" ,
        m."endTime" ,
        m.created_at
    order by m."startTime"
    offset ${offset}
    limit ${limit} `;

module.exports = async (req, res) => {
    try {
        const { startTime, endTime ,page=0} = req.query;

        if (!moment(startTime, DATEFORMAT).isValid() ||
            !moment(endTime, DATEFORMAT).isValid())
            return res.send({ success: false });

        //format date to proper format
        let start = moment(startTime, DATEFORMAT).format("MM/DD/YYYY");
        let end = moment(endTime, DATEFORMAT).format("MM/DD/YYYY");

        const offset = page*50;

        const query = getQuery(start, end,offset);
        const response = await db.query(query);

        res.json({ meetings: response.rows });
    } catch (err) {
        console.error(err);
        res.send({
            success: false
        })
    }
}