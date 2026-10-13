import {
    CONTENT_COLLECTIONS,
    CONTENT_SECTIONS,
    createItem,
    deleteItem,
    getContent,
    listItems,
    reorderItems,
    replaceContent,
    resetContent,
    updateItem,
    updateSection,
} from "../services/contentStore.js"

// Errors thrown by the store carry a `status`, so they only need forwarding to
// Express' error handler (see middleware/errorHandler.js).
function handle(res, status, work) {
    const data = work()
    res.status(status).json({ success: true, data })
}

export function readContent(_req, res) {
    handle(res, 200, () => getContent())
}

// Describes what is editable, so the admin never has to hardcode the schema.
export function readContentSchema(_req, res) {
    res.status(200).json({
        success: true,
        data: { sections: CONTENT_SECTIONS, collections: CONTENT_COLLECTIONS },
    })
}

export function putContent(req, res) {
    handle(res, 200, () => replaceContent(req.body))
}

export function patchSection(req, res) {
    handle(res, 200, () => updateSection(req.params.section, req.body))
}

export function postReset(req, res) {
    // No section means "reset everything".
    handle(res, 200, () => resetContent(req.params.section ?? req.body?.section ?? null))
}

export function getCollection(req, res) {
    handle(res, 200, () => listItems(req.params.collection))
}

export function postItem(req, res) {
    handle(res, 201, () => createItem(req.params.collection, req.body))
}

export function putItem(req, res) {
    handle(res, 200, () => updateItem(req.params.collection, req.params.id, req.body))
}

export function deleteCollectionItem(req, res) {
    handle(res, 200, () => deleteItem(req.params.collection, req.params.id))
}

export function putCollectionOrder(req, res) {
    handle(res, 200, () => reorderItems(req.params.collection, req.body?.ids))
}
