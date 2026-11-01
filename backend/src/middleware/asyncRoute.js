// Express 4 does not catch a rejected promise from a handler, so an async
// controller that throws (a store's httpError, a database outage) would hang the
// request instead of reaching errorHandler. This forwards the rejection.
export function asyncRoute(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}
