interface AvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 32, fontSize = 16 }) => {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    const initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}` 
      : names[0][0];
    return initials.toUpperCase();
  };

  const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return `#${"00000".substring(0, 6 - c.length)}${c}`;
  };

  const backgroundColor = generateColor(name);
  const initials = getInitials(name);

  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: `${fontSize}px`,
    textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
    userSelect: 'none',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={style} aria-label={name}>
      {initials}
    </div>
  );
};

export default Avatar;