import { rem } from '@mantine/core';

interface Props extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function ThumbUpIcon({ size, style, ...props }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...props}
    >
      <path
        d="M7.79796 10.6654C7.79796 10.6654 9.60654 5.58841 11.0082 4.76349C12.4098 3.93857 13.3442 5.2307 13.3442 6.16513C13.3442 7.09957 12.7031 10.0121 12.7031 10.0121L17.8253 9.37179C19.1211 9.20982 20.2016 10.3521 19.968 11.6369L18.8485 17.7944C18.6585 18.8395 17.6613 19.5357 16.6148 19.354L7.79796 17.8231M7.79796 10.6654V17.8231M7.79796 10.6654H5.51918C5.11627 10.6654 4.72986 10.8254 4.44496 11.1103C4.16006 11.3952 4 11.7816 4 12.1846V16.304C4 16.7069 4.16006 17.0933 4.44496 17.3782C4.72986 17.6631 5.11627 17.8231 5.51918 17.8231H7.79796"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ThumbUpIcon;
