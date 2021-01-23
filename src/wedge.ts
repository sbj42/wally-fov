/**
 * In this shadowcasting algorithm, shadows cut slices out of the visible range of angles.
 * Each visible range is represented by a "wedge" object, running from a "low" angle to a "high" angle.
 */
export type Wedge = {
    low: number;
    high: number;
};

// istanbul ignore next
function rangeToString(low: number, high: number) {
    return `${low.toFixed(7)}-${high.toFixed(7)}`;
}

// istanbul ignore next
function wedgeToString(wedge: Wedge) {
    return `{${rangeToString(wedge.low, wedge.high)}}`;
}

// istanbul ignore next
function wedgesToString(wedges: Wedge[]) {
    return `[${wedges.map(wedgeToString).join(', ')}]`;
}

// istanbul ignore next
function debugLog(msg: string) {
    // eslint-disable-next-line no-console
    console.info(msg);
}

export function initWedges(): Wedge[] {
    return [ { low: 0, high: Number.POSITIVE_INFINITY } ];
}

const DEBUG_CUTWEDGE = false;

/**
 * This function cuts a range of angles out of a wedge.
 */
export function cutWedge(wedge: Wedge, low: number, high: number): Wedge[] {
    // istanbul ignore next
    if (DEBUG_CUTWEDGE) {
        debugLog(`cut ${wedgeToString(wedge)} ${rangeToString(low, high)}`);
    }
    let ret: Wedge[];
    if (low <= wedge.low) {
        if (high >= wedge.high) {
            // wedge is entirely occluded, remove it
            ret = [];
        } else if (high >= wedge.low) {
            // low part of wedge is occluded, trim it
            wedge.low = high;
            ret = [wedge];
        } else {
            // cut doesn't reach the wedge
            ret = [wedge];
        }
    } else if (high >= wedge.high) {
        if (low <= wedge.high) {
            // high part of wedge is occluded, trim it
            wedge.high = low;
            ret = [wedge];
        } else {
            // cut doesn't reach the wedge
            ret = [wedge];
        }
    } else {
        // middle part of wedge is occluded, split it
        const nextWedge = {
            low: high,
            high: wedge.high,
        };
        wedge.high = low;
        ret = [wedge, nextWedge];
    }
    // istanbul ignore next
    if (DEBUG_CUTWEDGE) {
        debugLog(`--> ${wedgesToString(ret)}`);
    }
    return ret;
}

export function cutWedges(wedges: Wedge[], low: number, high: number): Wedge[] {
    const ret = new Array<Wedge>();
    for (const wedge of wedges) {
        ret.push(...cutWedge(wedge, low, high));
    }
    return ret;
}
