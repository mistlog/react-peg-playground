const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(".").filter(each => each.endsWith(".jsx"));
files.forEach(each => {
    const name = each.replace(".jsx", ".json");
    const code = fs.readFileSync(each, "utf8");
    const data = { code };
    fs.writeFileSync(path.resolve(__dirname, `./${name}`), JSON.stringify(data), "utf8");
})