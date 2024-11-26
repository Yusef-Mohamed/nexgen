import { InputProps } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const InputField: React.FC<InputProps> = ({
  input,
  isLoading,
  value,
  setData,
  inputs,
  notRequired,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={input.name}>{inputs(input.name)}</Label>
      {input.type === "select" ? (
        <Select
          value={value ? value : ""}
          onValueChange={(value) => {
            setData(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={inputs(input.name)} />
          </SelectTrigger>
          <SelectContent>
            {input.values?.map((value) => {
              return (
                <SelectItem value={value.value} key={value.value}>
                  {value.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ) : input.type === "textarea" ? (
        <Textarea
          disabled={isLoading}
          id={input.name}
          name={input.name}
          placeholder={inputs(input.name)}
          required={!notRequired}
          value={value ? value : undefined}
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
      ) : (
        <Input
          disabled={isLoading}
          id={input.name}
          name={input.name}
          placeholder={inputs(input.name)}
          required={!notRequired}
          value={value ? value : undefined}
          pattern={input.pattern}
          title={input.title}
          onChange={(e) => {
            if (input.type === "file" && e.target.files) {
              setData(e.target.files[0]);
              return;
            }
            setData(e.target.value);
          }}
          type={input.type}
        />
      )}
    </div>
  );
};
export default InputField;
