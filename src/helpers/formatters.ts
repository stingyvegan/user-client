import Pluralise from 'pluralize';

const formatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

/**
 * Format currency into human-readable string.
 * @param cents The amount of cents to format.
 * @returns Human-readable currency string.
 */
const formatCurrency = (cents: number) => {
  return formatter.format(cents / 100);
};

/**
 * Format a unit with no amount attached to it for display.
 * @param isDiscrete Whether or not the unitType is discrete.
 * @param unitName The name of the unit.
 */
const formatUnit = (isDiscrete: boolean, unitName: string) => {
  if (isDiscrete) {
    return Pluralise(unitName);
  } else {
    return unitName;
  }
};

/**
 * Format an individual unit into a human-readable string.
 * @param isDiscrete Whether or not the unitType is discrete.
 * @param unitSize The size of the unit.
 * @param unitName The name of the unit.
 */
const formatIndividualUnit = (isDiscrete: boolean, unitSize: number, unitName: string) => {
  if (isDiscrete) {
    return unitName;
  } else {
    return `${unitSize}${unitName}`;
  }
};

/**
 * Format unit amount into readable string,
 * for appropriate continuous amounts translate unit to appropriate size.
 * @param {number} totalUnits The total number of units.
 * @param unitName The name of the unit, eg 'g' or 'ml'.
 * @param isDiscrete Whether or not the unitType is discrete.
 */
const formatUnitSize = (totalUnits: number, unitName: string, isDiscrete: boolean) => {
  if (isDiscrete) {
    return `${totalUnits} ${Pluralise(unitName, totalUnits)}`;
  } else {
    let sTotalUnits = totalUnits;
    let sUnitName = unitName;
    switch (unitName) {
      case 'g':
        if (sTotalUnits >= 1000) {
          sTotalUnits /= 1000;
          sUnitName = 'kg';
        }
        break;
      default:
        break;
    }
    return `${sTotalUnits}${sUnitName}`;
  }
};

/**
 * Format the product progress to a human-readable string.
 * @param committedUnits The number of units that have been commited.
 * @param requiredUnits The required units to fill the order.
 * @param isDiscrete Whether or not the unitType is discrete.
 * @param unitSize The size of each unit.
 * @param unitName The name of the unit.
 */
const progressFormatter = (
  committedUnits: number,
  requiredUnits: number,
  isDiscrete: boolean,
  unitSize: number,
  unitName: string,
) => {
  if (isDiscrete) {
    return `${committedUnits * unitSize} of ${
      requiredUnits * unitSize
    } ${Pluralise(unitName, requiredUnits)}`;
  } else {
    return `${formatUnitSize(
      committedUnits * unitSize,
      unitName,
      isDiscrete,
    )} of ${formatUnitSize(requiredUnits * unitSize, unitName, isDiscrete)}`;
  }
};

/**
 * Format the given date.
 * @param date The date to format as a JS Date object or ISO string.
 */
const formatDate = (date: Date | string) => {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString('en-AU');
};

export {
  formatCurrency,
  progressFormatter,
  formatIndividualUnit,
  formatUnitSize,
  formatUnit,
  formatDate,
};
