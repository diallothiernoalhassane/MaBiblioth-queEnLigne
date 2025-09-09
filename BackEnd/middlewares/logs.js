const logs = (req,res,next) =>{
    const date = new Date().toISOString();
    console.log(`[${date}] ${req.method} ${req.url}`);
    next();
}

module.exports = logs;
