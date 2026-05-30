import { nodeAssets, sceneAssets } from "../assets/gameAssets";
import type { UiMapNode } from "../ui/types";

type MapEdge = {
  from: string;
  to: string;
  completed?: boolean;
};

type MapScreenProps = {
  floor: number;
  nodes: UiMapNode[];
  edges: MapEdge[];
  screenTransitionKey?: string | number;
  onSelectNode?: (node: UiMapNode) => void;
};

export function MapScreen({ floor, nodes, edges, screenTransitionKey, onSelectNode }: MapScreenProps) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className="map-view screen-fill room-enter" key={screenTransitionKey} style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.34), rgba(10,9,8,.68)), url(${sceneAssets.map})` }}>
      <header className="map-header">
        <h1>选择下一处房间</h1>
        <p>Floor {floor} · 可达节点已高亮</p>
      </header>
      <div className="map-canvas">
        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={edge.completed ? "is-completed" : ""} />;
          })}
        </svg>
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className={`map-node map-node--${node.type} is-${node.state}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => node.state === "available" && onSelectNode?.(node)}
            disabled={node.state === "locked"}
            aria-label={node.type}
          >
            <img src={nodeAssets[node.type]} alt="" />
          </button>
        ))}
      </div>
      <footer className="map-footer">选择一个发光节点进入房间。不可达节点会保留路线信息但不可点击。</footer>
    </section>
  );
}
