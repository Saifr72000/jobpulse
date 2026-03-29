import "./ChannelRow.scss";

interface ChannelRowProps {
  logo: string;
  name: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ChannelRow({
  logo,
  name,
  description,
  checked,
  disabled = false,
  onClick,
}: ChannelRowProps) {
  return (
    <div
      className={`channel-row${checked ? " channel-row--checked" : ""}${disabled ? " channel-row--disabled" : ""}`}
      onClick={() => !disabled && onClick()}
    >
      <span className="channel-row__logo-wrap">
        <img className="channel-row__logo" src={logo} alt={name} />
      </span>
      <span className="channel-row__text">
        <span className="body-2">{name}</span>
        {/* <span className="body-2">{description}</span> */}
      </span>
      <span
        className={`channel-row__check${checked ? " channel-row__check--checked" : ""}`}
      />
    </div>
  );
}
