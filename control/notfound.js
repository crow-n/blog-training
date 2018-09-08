module.exports = async ctx => {
    ctx.status = 404
    await ctx.render('404', {
        title: '404'
    })
}