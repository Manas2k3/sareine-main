"use client";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
    const { announcementText } = useSiteSettings();

    if (!announcementText) return null;

    return (
        <div className={styles.bar}>
            <p className={styles.text}>{announcementText}</p>
        </div>
    );
}
