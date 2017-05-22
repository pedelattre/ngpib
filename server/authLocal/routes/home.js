exports.homepage = function(req, res){
	res.render("homepage.jade", { myVar: req.user.username })
}