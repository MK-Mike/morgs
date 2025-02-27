import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "@/components/ui/scroll-area";

function MyScrollContainer({
  children,
  className,
  height = "h-48",
  width = "w-64",
}) {
  return (
    <ScrollArea
      className={`${className} ${height} ${width} rounded-md border p-2`}
    >
      <ScrollAreaViewport>
        <div className="space-y-2">{children}</div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}

export default MyScrollContainer;
