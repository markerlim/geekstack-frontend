import React from "react";

const tagsToIcons: { [key: string]: string } = {
  '[Impact 1]': '/icons/UAtags/CTImpact1.png',
  '[Impact 2]': '/icons/UAtags/CTImpact2.png',
  '[Impact]': '/icons/UAtags/CTImpact.png',
  '[Block x2]': '/icons/UAtags/CTBlkx2.png',
  '[Attack x2]': '/icons/UAtags/CTAtkx2.png',
  '[Snipe]': '/icons/UAtags/CTSnipe.png',
  '[Impact +1]': '/icons/UAtags/CTImpact+1.png',
  '[Step]': '/icons/UAtags/CTStep.png',
  '[Damage]': '/icons/UAtags/CTDmg.png',
  '[Damage +1]': '/icons/UAtags/CTDmg+1.png',
  '[Damage 2]': '/icons/UAtags/CTDmg2.png',
  '[Damage 3]': '/icons/UAtags/CTDmg3.png',
  '[Impact Negate]': '/icons/UAtags/CTImpactNegate.png',
  '[Once Per Turn]': '/icons/UAtags/CTOncePerTurn.png',
  '[Rest this card]': '/icons/UAtags/CTRestThisCard.png',
  '[Retire this card]': '/icons/UAtags/CTRetirethiscard.png',
  '[Place 1 card from hand to Outside Area]': '/icons/UAtags/CT1HandtoOA.png',
  '[Place 2 cards from hand to Outside Area]': '/icons/UAtags/CT2HandtoOA.png',
  '[When In Front Line]': '/icons/UAtags/CTWhenInFrontLine.png',
  '[When In Energy Line]': '/icons/UAtags/CTWhenInEnergyLine.png',
  '[Pay 1 AP]': '/icons/UAtags/CTPay1AP.png',
  '[Raid]': '/icons/UAtags/CTRaid.png',
  '[On Play]': '/icons/UAtags/CTOnPlay.png',
  '[On Retire]': '/icons/UAtags/CTOnRetire.png',
  '[On Block]': '/icons/UAtags/CTOnBlock.png',
  '[When Blocking]': '/icons/UAtags/CTWhenBlocking.png',
  '[Activate Main]': '/icons/UAtags/CTActivateMain.png',
  '[Activate: Main]': '/icons/UAtags/CTActivateMain.png',
  '[When Attacking]': '/icons/UAtags/CTWhenAttacking.png',
  '[Your Turn]': '/icons/UAtags/CTYourTurn.png',
  "[Opponent's Turn]": '/icons/UAtags/CTOppTurn.png',
  '[Trigger]': '/icons/UAtags/CTTrigger.png',
};

interface EffectWithIconsProps {
  text: string;
}

const EffectWithIcons: React.FC<EffectWithIconsProps> = ({ text }) => {
  // Create a regex to match all keys in tagsToIcons:
  const tagKeys = Object.keys(tagsToIcons)
    // Escape characters for regex (like [ ] )
    .map(k => k.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&'));
  const regex = new RegExp(`(${tagKeys.join('|')})`, 'g');

  // Split text by the tags, keeping tags in the array
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (tagsToIcons[part]) {
          return (
            <img
              key={i}
              src={tagsToIcons[part]}
              alt={part}
              style={{ height: 18, width:'auto', verticalAlign: 'middle', margin: '0 2px' }}
            />
          );
        }
        return part;
      })}
    </>
  );
};

export default EffectWithIcons;
