import { cloneObject } from "../../../utils";
import DropdownClassic from "../DropdownClassic";
import Input from "../Form/Input";

const Where = ({
  tableStructure,

  pseudonym,
  setPseudonym,
  pseudonymError,
  setPseudonymError,

  conditionMainTable,
  setConditionMainTable,
  conditionMainField,
  setConditionMainField,
  conditionSubTable,
  setConditionSubTable,
  conditionSubField,
  setConditionSubField,
  conditionOperation,
  setConditionOperation,
}) => {
  const operationOptions = [
    {
      value: null,
      title: "Select operation",
    },
    ...[">", "<", "=", "!=", ">=", "<="].map((operation) => ({
      value: operation,
      title: operation,
    })),
  ];

  const mainTableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
    ...Object.keys(tableStructure).map((table) => ({
      value: table,
      title: table,
    })),
  ];

  const subTableOptions = cloneObject(mainTableOptions);

  const mainFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (conditionMainTable) {
    tableStructure[conditionMainTable]["fields"].forEach((field) => {
      mainFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  const subFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (conditionSubTable) {
    tableStructure[conditionSubTable]["fields"].forEach((field) => {
      subFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  return (
    <div className="w-2/12 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-hidden">
      <div className="w-full mb-4">
        <Input
          name="field-pseudonym"
          value={pseudonym}
          setValue={setPseudonym}
          error={pseudonymError}
          setError={setPseudonymError}
          label="Field Pseudonym"
          placeholder="Enter Field Pseudonym"
          labelClassName="block text-sm font-semibold mb-1"
          inputClassName="form-input w-full"
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">
          Condition Main Table
        </label>
        <DropdownClassic
          selected={conditionMainTable}
          setSelected={(newValue) => setConditionMainTable(newValue)}
          needSearch={true}
          options={mainTableOptions}
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">
          Condition Main Field
        </label>
        <DropdownClassic
          selected={conditionMainField}
          setSelected={(newValue) => setConditionMainField(newValue)}
          needSearch={true}
          options={mainFieldOptions}
          dropdownDisabled={!conditionMainTable}
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">Condition</label>
        <DropdownClassic
          selected={conditionOperation}
          setSelected={(newValue) => setConditionOperation(newValue)}
          needSearch={true}
          options={operationOptions}
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">
          Condition Sub Table
        </label>
        <DropdownClassic
          selected={conditionSubTable}
          setSelected={(newValue) => setConditionSubTable(newValue)}
          needSearch={true}
          options={subTableOptions}
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-semibold mb-1">
          Condition Sub Field
        </label>
        <DropdownClassic
          selected={conditionSubField}
          setSelected={(newValue) => setConditionSubField(newValue)}
          needSearch={true}
          options={subFieldOptions}
          dropdownDisabled={!conditionSubTable}
        />
      </div>
    </div>
  );
};

export default Where;
