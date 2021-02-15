const getQuery = id => 
    `select
        m.id,
        m.title ,
        m."startTime" ,
        m."endTime" ,
        m.created_at ,
    jsonb_agg(jsonb_build_object('name',p.name,'email',p.email,'rsvp',p.rsvp)) as participants
    from meetings m 
    inner join participants p on m.id = p.meeting_id 
    where m.id = ${id}
    group by
        m.id,
        m.title ,
        m."startTime" ,
        m."endTime" ,
        m.created_at`;

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.send({ success: false });

        const query = getQuery(id);

        const response = await db.query(query);

        res.json({ meetings: response.rows });
    } catch (err) {
        console.error(err);
        res.send({
            success: false
        })
    }
}