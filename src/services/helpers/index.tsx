import { get } from "lodash";
import utils from "../utils";



const getCurrencyName = (code: string | null): string => {
    if (!code) return "";
    return utils.currencyCodes[code] || code;
};

const formatCurrencyAmount = (amount: string | number | null, currCode: string | null): string => {
    if (!amount) return "-";
    const numAmount = typeof amount === "string" ? Number(amount) : amount;
    if (isNaN(numAmount)) return "-";
    const currency = currCode ? getCurrencyName(currCode) : "";
    return `${numAmount.toLocaleString("ru-RU")}${currency ? ` ${currency}` : ""}`;
};

const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatInputPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    const phoneRegex = /(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/;

    const cleaned = phoneNumber.replace(/\D/g, "");

    const fullNumber = cleaned.startsWith("998") ? cleaned : `998${cleaned}`;

    const x = fullNumber.match(phoneRegex);

    if (!x) {
        return "+998";
    }

    return `+${x[1]} ${x[2]} ${x[3]} ${x[4]} ${x[5]}`.trim();
};

const beatifyPrice = (x: any, decimalPlaces: number = 0) => {
    const _x = Number(x);
    if (isNaN(_x)) return "";

    const parts = String(
        decimalPlaces > 0 ? _x.toFixed(decimalPlaces) : Math.floor(_x)
    ).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return parts.join(decimalPlaces > 0 ? "," : "");
};

const getNestedValue = (obj: any, path: string) => {
    const keys = path.split(".");
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
        if (current && current[keys[i]] !== undefined) {
            current = current[keys[i]];
        } else {
            return undefined;
        }
    }

    return current;
};


const spaceNumber = (number: number, decimalPlaces: number = 4) => {
    if (!number) return "";

    const regex = new RegExp(`(\\d{${decimalPlaces}})(?=\\d)`, "g");
    return number.toString().replace(regex, "$1 ");
};

const totalAmountBeautify = (data: any, name: string) => {
    return beatifyPrice(
        data.reduce((acc: any, item: any) => acc + Number(get(item, name, 0)), 0)
    );
};
const getFile = (file: any) => {
    const generateColor = (extension: string): string => {
        let hash = 0;
        for (let i = 0; i < extension.length; i++) {
            hash = extension.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} bayt`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const extension = file.ext || "";
    const color = generateColor(extension);
    const byte = formatFileSize(file.size);

    return { color, byte, extension };
};



function filterRoutesByPermissions(
    routes: any,
    userPermissions: string[]
): any {
    return routes
        .map((route: any) => {
            const hasChildren = route.children && route.children.length > 0;

            if (hasChildren) {
                // Parent o'zida permission bo'lsa tekshiramiz
                if (route.permissions?.length > 0) {
                    const parentAllowed = route.permissions.some((p: string) => userPermissions.includes(p));
                    if (!parentAllowed) return null;
                }
                const filteredChildren = filterRoutesByPermissions(route.children, userPermissions);
                return filteredChildren.length > 0
                    ? { ...route, children: filteredChildren }
                    : null;
            }

            // Permission yo'q → har doim ko'rsatiladi (section header yoki umumiy sahifa)
            if (!route.permissions || route.permissions.length === 0) {
                return route;
            }

            const hasPermission = route.permissions.some((permission: string) =>
                userPermissions.includes(permission)
            );

            return hasPermission ? route : null;
        })
        .filter((route: any) => route !== null);
}

const getWeekDay = (day: string) => {
    return utils.weekDays.find((item) => item.value === day)?.label;
}

const lessonDayType = (days: any) => {
    const oddDays = ['monday', 'wednesday', 'friday'];
    const evenDays = ['tuesday', 'thursday', 'saturday'];
    const isOdd = days.every((day: any) => oddDays.includes(get(day, 'day')));
    const isEven = days.every((day: any) => evenDays.includes(get(day, 'day')));


    const getType = () => {
        if (isOdd) return 'odd';
        if (isEven) return 'even';
        return 'custom';
    }

    return {
        type: getType(),
        start_time: get(days, '0.start_time'),
        end_time: get(days, '0.end_time'),
        days
    };

}


export default {
    getFile,
    getWeekDay,
    totalAmountBeautify,
    getNestedValue,
    formatInputPhoneNumber,
    formatBytes,
    beatifyPrice,
    getCurrencyName,
    formatCurrencyAmount,
    spaceNumber,
    filterRoutesByPermissions,
    lessonDayType
};
