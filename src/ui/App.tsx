import './App.css';
import ResearchCalcApp from './ResearchCalc/ResearchCalcApp';
import IvCalcApp from './IvCalc/IvCalcApp';
import React, { useCallback, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import PwaNotify from './PwaBanner';
import { useTranslation } from 'react-i18next'

/** Global configuration. */
export interface AppConfig {
    /** current language */
    language: string;
    /** PWA notify check counter */
    pwacnt: number,
}

export type AppType = "ResearchCalc" | "IvCalc";

export default function App({config}: {config:AppConfig}) {
    const language = useMultilingual(config);
    const [curApp, setCurApp] = useRouter(language);

    const onAppChange = useCallback((value: AppType) => {
        setCurApp(value);
    }, [setCurApp]);

    const onPwaBannerClose = useCallback(() => {
        config.pwacnt = 0;
        saveConfig(config);
    }, [config]);

    return (
        <>
            <ToolBar app={curApp} onAppChange={onAppChange}/>
            {curApp === "ResearchCalc" && <ResearchCalcApp/>}
            {curApp === "IvCalc" && <IvCalcApp/>}
            <PwaNotify app={curApp} pwaCount={config.pwacnt} onClose={onPwaBannerClose}/>
        </>
    );
}

/**
 * A custom react hook for managing multilingual support.
 * @param config The global configuration object.
 * @return Current language.
 */
function useMultilingual(config: AppConfig) {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(config.language);

    // Called when the language has been changed
    const onLanguageChanged = useCallback((value:string) => {
        setLanguage(value);
        saveConfig({...config, language: value});
    }, [config, setLanguage]);

    useEffect(() => {
        i18n.on("languageChanged", onLanguageChanged);
        return () => {
            i18n.off("languageChanged", onLanguageChanged);
        };
    }, [i18n, onLanguageChanged]);

    return language;
}

/**
 * A custom react hook for managing URL.
 * @param language Current language.
 * @return Current app type and setter for it.
 */
function useRouter(language: string): [AppType, (v:AppType) => void] {
    let initialApp: AppType = (
        window.location.pathname.startsWith("/pokesleep-tool/iv/") ?
        "IvCalc" : "ResearchCalc");

    const { t, i18n } = useTranslation();
    const [currentApp, setCurrentApp] = useState<AppType>(initialApp);
    useEffect(() => {
        // Replace on memory HTML
        document.title = t(`${currentApp}.title`);
        const manifest = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
        if (manifest !== null) {
            const current = manifest.href;
            manifest.href = current.replace(/manifest.*/, "manifest." + language + ".json");
        }
        const description = document.querySelector<HTMLMetaElement>("meta[name='description']");
        if (description !== null) {
            description.content = t(`${currentApp}.description`);
        }

        // update URL
        let url = document.location.origin + "/pokesleep-tool/";
        if (currentApp === "IvCalc") {
            url += 'iv/';
        }
        if (language !== "en") {
            url += `index.${language}.html`;
        }
        const query = document.location.search;
        window.history.replaceState(null, '', url + query);
    }, [language, i18n, t, currentApp]);
    return [currentApp, setCurrentApp];
}

export function loadConfig(language:string): AppConfig {
    const config: AppConfig = {
        language,
        pwacnt: -1,
    };

    const data = localStorage.getItem("PokeSleepTool");
    if (data === null) {
        return config;
    }
    const json = JSON.parse(data);
    if (typeof(json) !== "object" || json == null) {
        return config;
    }
    if (typeof(json.language) === "string") {
        config.language = json.language;
    }
    if (typeof(json.pwacnt) == "number") {
        config.pwacnt = json.pwacnt;
    }
    return config;
}

export function saveConfig(state:AppConfig) {
    localStorage.setItem("PokeSleepTool", JSON.stringify(state));
}
