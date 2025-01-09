// Reusable InputField Component
const InputField = ({
  label,
  value,
  placeholder,
  onChange,
  disabled,
  type = "text",
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

// Updated AddressInputs Component
export default function AddressInputs({
  addressProps,
  setAddressProp,
  disabled = false,
}) {
  const { phone, streetAddress, postalCode, city, country } = addressProps;

  return (
    <>
      <InputField
        label="Phone"
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(ev) => setAddressProp("phone", ev.target.value)}
        disabled={disabled}
      />
      <InputField
        label="Street address"
        placeholder="Street address"
        value={streetAddress}
        onChange={(ev) => setAddressProp("streetAddress", ev.target.value)}
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="Postal code"
          placeholder="Postal code"
          value={postalCode}
          onChange={(ev) => setAddressProp("postalCode", ev.target.value)}
          disabled={disabled}
        />
        <InputField
          label="City"
          placeholder="City"
          value={city}
          onChange={(ev) => setAddressProp("city", ev.target.value)}
          disabled={disabled}
        />
      </div>
      <InputField
        label="Country"
        placeholder="Country"
        value={country}
        onChange={(ev) => setAddressProp("country", ev.target.value)}
        disabled={disabled}
      />
    </>
  );
}
