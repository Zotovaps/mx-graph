this.xmlToJson = (xml) => {
    const result = new Object()
    const root = xml.getElementsByTagName("root")[0]

    const dict = new Object()


    if (root.childNodes.length > 0) {
        result.boxes = [];

        Array.from(root.childNodes).filter(x => x.getAttribute("vertex") === "1").forEach(child => {
            const element = new Object()
            const style = child.getAttribute("style")
            if (style) {
                if (style.includes("shape=table;")) {
                    element.body = new Object()
                    element.body.rows = []
                    element.type = "table"
                }
            }
            element.id = child.getAttribute("id");

            dict[element.id] = element


            const parent = child.getAttribute("parent");

            if (parent !== null && dict[parent]) {
                if (dict[parent].type === "table") {
                    element.type = "row"
                    element.columns = []
                    dict[parent].body.rows.push(element)
                }
                if (dict[parent].type === "row") {
                    element.type = "column"
                    element.box_id = element.id
                    delete element.id
                    element.caption = child.getAttribute("value")


                    dict[parent].columns.push({item: element})
                }


            } else {
                const geometry = child.getElementsByTagName("mxGeometry")[0]
                if (geometry) {
                    element.header = new Object()
                    element.header.position = new Object()
                    element.header.size = new Object()

                    element.header.caption = child.getAttribute("value");
                    element.header.position.top = geometry.getAttribute("y");
                    element.header.position.left = geometry.getAttribute("x");
                    element.header.size.width = geometry.getAttribute("width");
                    element.header.size.height = geometry.getAttribute("height");
                }


                result.boxes.push(element)
            }


            // console.log(child)
        })


        Array.from(root.childNodes).filter(x => x.getAttribute("edge") === "1").forEach(child => {
            const parent = child.getAttribute("source");

            if (!dict[parent].box_links) {
                dict[parent].box_links=[]
            }
            dict[parent].box_links.push({link: {
                    "typelink": 1,
                    "box_id": child.getAttribute("target")
                }})
        })
    }

    return result
}