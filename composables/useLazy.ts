export default function (cb: () => void) {
  setTimeout(() => cb(), 0);
}
