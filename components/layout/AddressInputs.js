// Reusable InputField Component
const InputField = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
  type = "text",
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
    <form className="space-y-4">
      <InputField
        id="phone"
        label="Phone"
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(ev) => setAddressProp("phone", ev.target.value)}
        disabled={disabled}
      />
      <InputField
        id="streetAddress"
        label="Street Address"
        placeholder="Street address"
        value={streetAddress}
        onChange={(ev) => setAddressProp("streetAddress", ev.target.value)}
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="postalCode"
          label="Postal Code"
          placeholder="Postal code"
          value={postalCode}
          onChange={(ev) => setAddressProp("postalCode", ev.target.value)}
          disabled={disabled}
        />
        <InputField
          id="city"
          label="City"
          placeholder="City"
          value={city}
          onChange={(ev) => setAddressProp("city", ev.target.value)}
          disabled={disabled}
        />
      </div>
      <InputField
        id="country"
        label="Country"
        placeholder="Country"
        value={country}
        onChange={(ev) => setAddressProp("country", ev.target.value)}
        disabled={disabled}
      />
    </form>
  );
}
