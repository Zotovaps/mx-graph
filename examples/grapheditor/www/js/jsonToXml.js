let count = 0;
const doc = document.implementation.createDocument("", "", null);
let root
this.jsonToXml = (json) => {
    var customMxGraphModel = doc.createElement("mxGraphModel");

    root = doc.createElement("root");
    var mxCell0 = doc.createElement("mxCell");
    mxCell0.setAttribute("id", (count++).toString());

    var mxCell1 = doc.createElement("mxCell");
    mxCell1.setAttribute("id", (count++).toString());
    mxCell1.setAttribute("parent", mxCell0.getAttribute("id"));

    json.boxes.forEach((item, index) => {
        const newCell = doc.createElement("mxCell")
        newCell.setAttribute("id", item.id);
        newCell.setAttribute("parent", mxCell1.getAttribute("id"));
        newCell.setAttribute("value", item.header.caption)
        newCell.setAttribute("vertex", "1")
        // newCell.setAttribute("style", "swimlane;childLayout=stackLayout;")

        const newGeometry = doc.createElement("mxGeometry")
        newGeometry.setAttribute("as", "geometry");
        newGeometry.setAttribute("x", item.header.position.left);
        newGeometry.setAttribute("y", item.header.position.top);
        newGeometry.setAttribute("width", item.header.size.width);
        newGeometry.setAttribute("height", item.header.size.height);


        item.body && Object.keys(item.body).forEach(k => {
            if (k === "rows") {
                newCell.setAttribute("style", "shape=table;childLayout=tableLayout;")
                newGeometry.setAttribute("width", (60 * item.body.rows[0].columns.length).toString());
                newGeometry.setAttribute("height", (40 + (40 * item.body.rows.length)).toString());

                item.body.rows.forEach((row, rowIndex) => {
                    const rowCell = doc.createElement("mxCell")
                    rowCell.setAttribute("id", (count++).toString());
                    rowCell.setAttribute("parent", newCell.getAttribute("id"));
                    rowCell.setAttribute("vertex", "1")
                    rowCell.setAttribute("style", "shape=partialRectangle;")


                    const rowGeometry = doc.createElement("mxGeometry")
                    rowGeometry.setAttribute("as", "geometry");
                    rowGeometry.setAttribute("y", (40 + (40 * rowIndex)).toString());
                    rowGeometry.setAttribute("height", "40");
                    rowGeometry.setAttribute("width", (60 * row.columns.length).toString());

                    rowCell.appendChild(rowGeometry)
                    row.columns.forEach((column, columnIndex) => {
                        const columnCell = doc.createElement("mxCell")
                        columnCell.setAttribute("id", column.item.box_id);
                        columnCell.setAttribute("parent", rowCell.getAttribute("id"));
                        columnCell.setAttribute("vertex", "1")
                        columnCell.setAttribute("value", column.item.caption)
                        columnCell.setAttribute("style", "shape=partialRectangle;")


                        const columnGeometry = doc.createElement("mxGeometry")
                        columnGeometry.setAttribute("as", "geometry");
                        columnGeometry.setAttribute("width", "60");
                        columnGeometry.setAttribute("height", "40");
                        columnIndex > 0 && columnGeometry.setAttribute("x", (60 * columnIndex).toString())

                        columnCell.appendChild(columnGeometry)
                        root.appendChild(columnCell)

                        // console.log(column)

                        if (column.item.box_links && column.item.box_links.length > 0) {
                            column.item.box_links.forEach(link => {
                                console.log("source", columnCell.getAttribute("id"))
                                const linkCell = doc.createElement("mxCell")
                                linkCell.setAttribute("id", (count++).toString());
                                linkCell.setAttribute("parent", mxCell1.getAttribute("id"));
                                linkCell.setAttribute("edge", "1");
                                linkCell.setAttribute("source", columnCell.getAttribute("id"));
                                linkCell.setAttribute("target", link.link.box_id);


                                const linkGeometry = doc.createElement("mxGeometry")
                                linkGeometry.setAttribute("as", "geometry");
                                linkCell.appendChild(linkGeometry)


                                root.appendChild(linkCell)
                            })
                        }


                    })

                    root.appendChild(rowCell)

                })

            }
            if (k === "json") {
                newGeometry.setAttribute("width", "140");
                let y = 26;

                Object.keys(item.body.json).forEach((k, kIndex) => {

                        if (typeof item.body.json[k] !== "object") {
                            const jsonCell = doc.createElement("mxCell")
                            jsonCell.setAttribute("id", (count++).toString());
                            jsonCell.setAttribute("parent", newCell.getAttribute("id"));
                            jsonCell.setAttribute("vertex", "1")
                            jsonCell.setAttribute("value", k + ": " + item.body.json[k])


                            const jsonGeometry = doc.createElement("mxGeometry")
                            jsonGeometry.setAttribute("as", "geometry");
                            jsonGeometry.setAttribute("y", y.toString());
                            jsonGeometry.setAttribute("height", "26");
                            jsonGeometry.setAttribute("width", "140");

                            jsonCell.appendChild(jsonGeometry)
                            root.appendChild(jsonCell)
                        }
                        else{
                            // createList(k, y, item.body.json[k], newCell.getAttribute("id"))


                        }


                        y+=26
                    }
                )
            }

        })


        newCell.appendChild(newGeometry)
        root.appendChild(newCell)
    })


    root.appendChild(mxCell0);
    root.appendChild(mxCell1);
    customMxGraphModel.appendChild(root);
    doc.appendChild(customMxGraphModel)

    return doc.documentElement.outerHTML
}

function createList(k,y, body, parentId){
    const listCell = doc.createElement("mxCell")
    listCell.setAttribute("id", (count++).toString());
    listCell.setAttribute("parent", parentId);
    listCell.setAttribute("vertex", "1")
    listCell.setAttribute("value", k + ":12")


    const listGeometry = doc.createElement("mxGeometry")
    listGeometry.setAttribute("as", "geometry");
    listGeometry.setAttribute("y", y.toString());
    listGeometry.setAttribute("width", "140");
    listGeometry.setAttribute("height", (26 + (26 * Object.keys(body).length)).toString());

    Object.keys(body).forEach((key, kIndex) => {
        let newY = 26;
        if (typeof body[key] !== "object") {
            const jsonCell = doc.createElement("mxCell")
            jsonCell.setAttribute("id", (count++).toString());
            jsonCell.setAttribute("parent", listCell.getAttribute("id"));
            jsonCell.setAttribute("vertex", "1")
            jsonCell.setAttribute("value", key + ": " + body[key])


            const jsonGeometry = doc.createElement("mxGeometry")
            jsonGeometry.setAttribute("as", "geometry");
            jsonGeometry.setAttribute("y", newY.toString());
            jsonGeometry.setAttribute("height", "26");
            jsonGeometry.setAttribute("width", "140");

            jsonCell.appendChild(jsonGeometry)
            root.appendChild(jsonCell)
            newY+=26

        }


    })


    listCell.appendChild(listGeometry)
    root.appendChild(listCell)
}