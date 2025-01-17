import React from 'react';
import { styled } from '@mui/system';
import PokemonIv from '../../util/PokemonIv';
import { IngredientName } from '../../data/pokemons';
import PokemonStrength, { CalculateResult } from '../../util/PokemonStrength';
import { getSkillValue } from '../../util/MainSkill';
import { CalculateParameter } from '../../util/PokemonStrength';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SwipeOutlinedIcon from '@mui/icons-material/SwipeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import InfoButton from './InfoButton';
import DreamShardIcon from '../Resources/DreamShardIcon';
import IngredientIcon from './IngredientIcon';
import IngredientsIcon from '../Resources/IngredientsIcon';
import PotIcon from '../Resources/PotIcon';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next'

const StyledBerryIngSkillStrengthView = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    margin: '0 -0.5rem',
    '& > h2': {
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        margin: '0 0.2rem',
        fontSize: '1.5rem',
        '& > span': {
            transform: 'scale(1, 0.9)',
        },
    },
    '& > section': {
        borderLeft: '2px dotted #ccc',
        position: 'relative',
        padding: '0 0 2rem',
        '&:first-of-type': {
            borderLeft: 0,
        },
        '& > h3': {
            width: 'calc(100% - 2rem)',
            fontSize: '.8rem',
            fontWeight: 400,
            textAlign: 'center',
            color: 'white',
            borderRadius: '.8rem',
            verticalAlign: '20%',
            margin: '.3rem 0 .1rem 1rem',
        },
        '& > article': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontWeight: 600,
            textAlign: 'center',
            verticalAlign: 'middle',
            fontSize: '1.1rem',
            margin: 'auto 0',
            height: '3rem', 
            '& span': {
                verticalAlign: 'middle',
            },
            '& svg': {
                verticalAlign: 'middle',
            },
            '& span.unit': {
                display: 'inline-block',
                paddingLeft: '.1rem',
                fontSize: '0.6rem',
                verticalAlign: 'bottom',
            },
            '&.ingc': {
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                '& > span.ing': {
                    textAlign: 'right',
                    '& > svg': { width: '0.8em', height: '0.8em', paddingRight: '0.1rem'},
                    '& > span': { fontSize: '0.8em'},
                },
                '& > span.strength': {
                    paddingLeft: '0.3rem',
                    textAlign: 'right',
                    '& > svg': { width: '0.6em', height: '0.6em'},
                    '& > span': { fontSize: '0.6em'},
                },
            },
            '&.ing2': {
                lineHeight: '50%',
            },
            '&.ing3': {
                fontSize: '0.8em',
                lineHeight: '50%',
            },
        },
        '& > footer': {
            fontSize: '0.7rem',
            bottom: 0,
            color: '#666',
            position: 'absolute',
            right: '1rem',
            '& > div': {
                textAlign: 'right',
            },
        },
    },
});

const StrengthBerryIngSkillStrengthView = React.memo(({pokemonIv, settings}: {
    pokemonIv: PokemonIv,
    settings: CalculateParameter,
}) => {
    const { t } = useTranslation();
    const [helpOpen, setHelpOpen] = React.useState(false);

    const strength = new PokemonStrength(pokemonIv);
    const isWhistle = (settings.period === 3);
    const result = strength.calculate({
        ...settings,
        averageEfficiency: isWhistle ?
            2.2222 : settings.averageEfficiency,
        isGoodCampTicketSet: isWhistle ?
            false : settings.isGoodCampTicketSet,
    });

    function trunc1(n: number): string {
        n = Math.round(n * 10) / 10;
        return t('num', {n: Math.floor(n)}) +
            "." + (n * 10 % 10);
    }
    function trunc2(n: number): string {
        n = Math.round(n * 100) / 100;
        let m = Math.floor(n * 100) % 100;
        return t('num', {n: Math.floor(n)}) +
            "." + (m < 10 ? `0${m}` : m.toString());
    };

    // format berry value
    const berryStrength = t('num', {n: Math.round(result.berryTotalStrength)});

    // summarize ing value
    const ingArticle = getIngArticle(result, settings, t, trunc1);

    // skill value
    const mainSkillTitle = getMainSkillTitle(pokemonIv, result, settings,
        t, trunc1, trunc2);

    const onHelpClick = React.useCallback(() => {
        setHelpOpen(true);
    }, [setHelpOpen]);
    const onHelpClose = React.useCallback(() => {
        setHelpOpen(false);
    }, [setHelpOpen]);
    
    return <StyledBerryIngSkillStrengthView>
        <h2>
            <LocalFireDepartmentIcon sx={{color: "#ff944b"}}/>
            <span>{t('num', {n: Math.round(result.totalStrength)})}</span>
            <InfoButton onClick={onHelpClick}/>
            <HelpDialog open={helpOpen} onClose={onHelpClose}/>
        </h2>
        <section>
            <h3 style={{background: '#24d76a'}}>{t('berry')}</h3>
            <article>
                <div>
                    <LocalFireDepartmentIcon sx={{color: "#ff944b"}}/>
                    <span>{berryStrength}</span>
                </div>
            </article>
            <footer>
                <div>{trunc1(result.berryRatio * 100)}%</div>
                <div>{trunc1(result.berryHelpCount)}{t('times unit')}</div>
            </footer>
        </section>
        <section>
            <h3 style={{background: '#fab855'}}>{t('ingredient')}</h3>
            {ingArticle}
            <footer>
                <div>{trunc1(result.ingRatio * 100)}%</div>
                <div>{trunc1(result.ingHelpCount)}{t('times unit')}</div>
            </footer>
        </section>
        <section>
            <h3 style={{background: '#44a2fd'}}>{t('skill')}</h3>
            <article><div>{mainSkillTitle}</div></article>
            <footer>
                <div>{trunc1(result.skillRatio * 100)}%</div>
                <div>{trunc2(result.skillCount)}{t('times unit')}</div>
            </footer>
        </section>
    </StyledBerryIngSkillStrengthView>;
});

function getIngArticle(result: CalculateResult, settings: CalculateParameter,
    t: typeof i18next.t,
    trunc1: (n: number) => string): React.ReactNode {
    if (settings.tapFrequency === 'none') {
        return <article>ー</article>;
    }

    const ing: {[name: string]: {count: number, strength: number}} = {};
    const ingNames: IngredientName[] = [];
    ing[result.ing1.name] = {count: result.ing1.count, strength: result.ing1.strength};
    ingNames.push(result.ing1.name);
    if (result.ing2.count > 0) {
        if (!(result.ing2.name in ing)) {
            ing[result.ing2.name] = {count: 0, strength: 0};
            ingNames.push(result.ing2.name);
        }
        ing[result.ing2.name].count += result.ing2.count;
        ing[result.ing2.name].strength += result.ing2.strength;
    }
    if (result.ing3 !== undefined && result.ing3.count > 0) {
        if (!(result.ing3.name in ing)) {
            ing[result.ing3.name] = {count: 0, strength: 0};
            ingNames.push(result.ing3.name);
        }
        ing[result.ing3.name].count += result.ing3.count;
        ing[result.ing3.name].strength += result.ing3.strength;
    }
    const ingValue = <>
        {ingNames.map(x => <React.Fragment key={x}>
            <span className="ing">
                <IngredientIcon name={x}/>
                <span>{trunc1(ing[x].count)}</span>
            </span>
            <span className="strength">
                <LocalFireDepartmentIcon sx={{color: "#ff944b"}}/>
                <span>{t('num', {n: Math.floor(ing[x].strength)})}</span>
            </span>
        </React.Fragment>)}
    </>;
    return <article className={`ingc ing${ingNames.length}`}>{ingValue}</article>
}

function getMainSkillTitle(pokemonIv: PokemonIv, result: CalculateResult,
    settings: CalculateParameter, t: typeof i18next.t,
    trunc1: (n: number) => string,
    trunc2: (n: number) => string): React.ReactNode {
    if (settings.period === 3 || settings.tapFrequency === 'none') {
            return <>ー</>;
    }

    const mainSkill = pokemonIv.pokemon.skill;
    const mainSkillBase = getSkillValue(mainSkill, pokemonIv.skillLevel);
    let mainSkillFactor = 1;
    if (mainSkill === "Charge Energy S") {
        const factor = pokemonIv.nature.energyRecoveryFactor;
        mainSkillFactor = (factor === 1 ? 1.2 : factor === -1 ? 0.88 : 1);
    }
    const mainSkillValue = trunc1(mainSkillBase * mainSkillFactor * result.skillCount);

    switch (mainSkill) {
        case "Charge Energy S":
        case "Energizing Cheer S":
            return <>
                <FavoriteBorderIcon sx={{color: "#ff88aa"}}/>
                <span>{mainSkillValue}</span>
            </>;
        case "Energy for Everyone S":
            return <>
                <VolunteerActivismOutlinedIcon sx={{color: "#ff88aa"}}/>
                <span>{mainSkillValue}</span>
            </>;
        case "Charge Strength M":
        case "Charge Strength S":
        case "Charge Strength S (Random)":
            return <>
                <LocalFireDepartmentIcon sx={{color: "#ff944b"}}/>
                <span>{t('num', {n: Math.round(mainSkillBase * mainSkillFactor *
                    result.skillCount * (1 + settings.fieldBonus / 100))})}</span>
            </>;
        case "Dream Shard Magnet S":
        case "Dream Shard Magnet S (Random)":
            return <>
                <DreamShardIcon/>
                <span style={{paddingLeft: '0.2rem'}}>{mainSkillValue}</span>
            </>;
        case "Extra Helpful S":
        case "Helper Boost":
            return <>
                <SearchIcon sx={{color: "#66cc66"}}/>
                <span style={{paddingLeft: '0.2rem'}}>{mainSkillValue}</span>
            </>;
        case "Ingredient Magnet S":
            return <>
                <IngredientsIcon/>
                <span style={{paddingLeft: '0.2rem'}}>{mainSkillValue}</span>
            </>;
        case "Cooking Power-Up S":
            return <>
                <svg width="18" height="18" fill="#886666"><PotIcon/></svg>
                <span>{mainSkillValue}</span>
            </>;
        case "Tasty Chance S":
            return <>
                <svg width="18" height="18" fill="#886666"><PotIcon/></svg>
                <span>{mainSkillValue}</span>
            </>;
        case "Metronome":
            return <>
                <SwipeOutlinedIcon sx={{color: "#999", paddingRight: "0.2rem"}}/>
                <span>{trunc2(result.skillCount)}</span>
            </>;
        default:
            return <>ー</>;
    }
}

const HelpDialog = React.memo(({open, onClose}: {
    open: boolean,
    onClose: () => void,
}) => {
    const { t } = useTranslation();

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('strength2')}</DialogTitle>
        <DialogContent dividers style={{fontSize: '0.95rem'}}>
            <p style={{marginTop: 0}}>{t('strength detail1')}</p>
            <p>{t('strength detail2')}</p>
            <ul style={{paddingLeft: '1rem'}}>
                <li>{t('strength restriction1')}</li>
                <li>{t('strength restriction2')}</li>
            </ul>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>{t('close')}</Button>
        </DialogActions>
    </Dialog>;
});

export default StrengthBerryIngSkillStrengthView;
