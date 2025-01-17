import React from 'react';
import PokemonIv from '../../util/PokemonIv';
import PokemonRp, { trunc, trunc1, trunc2 } from '../../util/PokemonRp';
import BerryIngSkillView from './BerryIngSkillView';
import RaderChart from './RaderChart';
import { Button, Dialog, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';

const RpView = React.memo(({pokemonIv, width}: {pokemonIv: PokemonIv, width: number}) => {
    const { t } = useTranslation();
    const [rpInfoOpen, setRpInfoOpen] = React.useState(false);
    const [rpType, setRpType] = React.useState<"berry"|"ingredient"|"skill">("berry");

    const onBerryInfoClick = React.useCallback(() => {
        setRpInfoOpen(true);
        setRpType("berry");
    }, [setRpInfoOpen]);
    const onIngInfoClick = React.useCallback(() => {
        setRpInfoOpen(true);
        setRpType("ingredient");
    }, [setRpInfoOpen]);
    const onSkillInfoClick = React.useCallback(() => {
        setRpInfoOpen(true);
        setRpType("skill");
    }, [setRpInfoOpen]);
    const onRpInfoClose = React.useCallback(() => {
        setRpInfoOpen(false);
    }, [setRpInfoOpen]);

    const rp = new PokemonRp(pokemonIv);
    const rpResult = rp.calculate();

    const pokemon = rp.pokemon;
    const raderHeight = 400;

    return (<>
        <div>
            <div style={{transform: 'scale(1, 0.9)'}}>
                <span style={{
                    color: '#fd775d',
                    fontWeight: 'bold',
                    paddingRight: '.4rem',
                    fontSize: '.8rem',
                    verticalAlign: '15%',
                }}>{t('rp')}</span>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                }}>{t('num', {n: rpResult.rp})}</span>
            </div>
            <BerryIngSkillView
                berryValue={trunc1(rpResult.berryRp)}
                berryProb={trunc1(rp.berryRatio * 100)}
                berrySubValue={`${t('strength2')}: ${rp.berryStrength}×${rp.berryCount}`}
                onBerryInfoClick={onBerryInfoClick}
                ingredientValue={trunc1(rpResult.ingredientRp)}
                ingredientProb={trunc1(rp.ingredientRatio * 100)}
                ingredientSubValue={`${t('strength2')}: ${rp.ingredientEnergy}×${trunc1(rp.ingredientG)}`}
                onIngredientInfoClick={onIngInfoClick}
                skillValue={trunc1(rpResult.skillRp)}
                skillProb={trunc1(rp.skillRatio * 100)}
                skillSubValue={`${t('strength2')}: ${t('num', {n: rp.skillValue})}`}
                onSkillInfoClick={onSkillInfoClick}/>
            <RpInfoDialog open={rpInfoOpen} onClose={onRpInfoClose}
                rp={rp} rpType={rpType}/>
        </div>
        <RaderChart width={width} height={raderHeight} speciality={pokemon.speciality}
            berry={rpResult.berryRp / 2000}
            ingredient={rpResult.ingredientRp / 2000}
            skill={rpResult.skillRp / 2000}/>
    </>);
});

const StyledRpDialog = styled(Dialog)({
    '& header': {
        margin: '1rem',
        '& > h1': {
            fontSize: '1.5rem',
            margin: 0,
            '& > span': {
                fontWeight: 400,
                display: 'inline-block',
                width: '4rem',
                fontSize: '.6rem',
                padding: '.1rem 0',
                textAlign: 'center',
                color: 'white',
                borderRadius: '.6rem',
                verticalAlign: '50%',
            },
            '& > strong': {
                paddingLeft: '0.5rem',
            },
        },
        '& > h2': {
            display: 'inline-block',
            fontWeight: 'normal',
            fontSize: '0.9rem',
            margin: '0.3rem 0 0 0.5rem',
            lineHeight: '1.9',
        },
    },

    '& article': {
        margin: '1rem .5rem 0 .5rem',
        display: 'grid',
        gridGap: '.5rem',
        rowGap: '.8rem',
        gridTemplateColumns: 'max-content 1fr',
        fontSize: '0.9rem',
        '& > div': {
            textAlign: 'right',
        }
    },
    '& footer': {
        margin: '1rem 1rem 0 1rem',
        fontSize: '0.8rem',
        '& > p': {
            margin: '.5rem 0 0 0',
        },
    },
    '& span.box': {
        borderRadius: '.3rem',
        padding: '.1rem .4rem',
        margin: '0',
        color: 'white',
        textAlign: 'center',
    },
    '& span.box1': { background: '#1ebee1' },
    '& span.box2': { background: '#27c18e' },
    '& span.box3': { background: '#e7c300' },
    '& span.box4': { background: '#ce5052' },
    '& span.box5': { background: '#ce3fa3' },
});

const RpInfoDialog = React.memo(({open, onClose, rp, rpType}: {
    open: boolean,
    onClose: () => void,
    rp: PokemonRp,
    rpType: "berry"|"ingredient"|"skill",
}) => {
    const { t } = useTranslation();
    let color = "", rpVal = "", title = t(rpType);
    const param1 = trunc2(rp.helpCountPer5Hour);
    const desc1 = t('helps per 5 hours');
    let param2 = "", desc2 = "", param3 = "", desc3 = "",
        param4 = "", desc4 = "";
    const bonus = rp.bonus;
    const param5 = bonus.toString();
    if (rpType === "berry") {
        color = '#24d76a';
        rpVal = trunc1(rp.berryRp * bonus);
        param2 = trunc1(rp.berryRatio * 100) + '%';
        desc2 = t('berry rate');
        param3 = rp.berryStrength.toString();
        desc3 = t('berry strength');
        param4 = rp.berryCount.toString()
        desc4 = t('berry count');
    }
    else if (rpType === "ingredient") {
        color = '#fab855';
        rpVal = trunc1(rp.ingredientRp * bonus);
        param2 = trunc1(rp.ingredientRatio * 100) + '%';
        desc2 = t('ingredient rate');
        param3 = trunc(rp.ingredientEnergy, 1).toString();
        desc3 = t('ingredient strength');
        param4 = trunc(rp.ingredientG, 3).toString();
        desc4 = t('ingredient factor');
    }
    else {
        color = '#44a2fd';
        rpVal = trunc1(rp.skillRp * bonus);
        param2 = trunc1(rp.skillRatio * 100) + '%';
        desc2 = t('skill rate');
        param3 = t('num', {n: rp.skillValue});
        desc3 = t('skill strength');
    }

    return <StyledRpDialog open={open} onClose={onClose}>
        <header>
            <h1>
                <span style={{background: color}}>{title}</span>
                <strong>{rpVal}</strong>
            </h1>
            <h2>
                <span className="box box1">{param1}</span><> × </>
                <span className="box box2">{param2}</span><> × </>
                <span className="box box3">{param3}</span><> × </>
                {param4 !== "" && <><span className="box box4">{param4}</span><> × </></>}
                <span className="box box5">{param5}</span>
            </h2>
        </header>
        <article>
            <div><span className="box box1">{param1}</span></div>
            <span>{desc1}</span>
            <div><span className="box box2">{param2}</span></div>
            <span>{desc2}</span>
            <div><span className="box box3">{param3}</span></div>
            <span>{desc3}</span>
            {param4 !== "" && <>
            <div><span className="box box4">{param4}</span></div>
            <span>{desc4}</span>
            </>}
            <div><span className="box box5">{param5}</span></div>
            <span><Trans i18nKey="bonus factor" components={{
                nature: <>{rp.energyBonus.toFixed(2)}</>,
                subskill: <>{rp.subSkillBonus.toFixed(2)}</>,
            }}/></span>
        </article>
        <footer>
            <p><Trans i18nKey="rp formula" components={{
                link: <a href={t('rp formula doc url')}>{t('rp formula doc title')}</a>
            }}/></p>
            <p>{t('rp estimate')}</p>
        </footer>
        <DialogActions>
            <Button onClick={onClose}>{t('close')}</Button>
        </DialogActions>
    </StyledRpDialog>;
});

export default RpView;
