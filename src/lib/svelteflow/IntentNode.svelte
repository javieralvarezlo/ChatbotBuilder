<script lang="ts">
    import { Handle, Position, useNodes, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
    import type { Writable } from 'svelte/store';
   
    type $$Props = NodeProps;
   
    export let data: { name: Writable<string> };
   
    const { name } = data;

  </script>
   
  <div class="intent">
    <Handle type="target" position={Position.Left} />
    <div>
      Intención: <strong>{name}</strong>
    </div>
    <Handle type="source" position={Position.Right} />
  </div>
   
  <style>
    .intent {
      padding: 1rem;
      background: #eee;
      border-radius: 0.125rem;
      font-size: 0.7rem;
      border: 1px solid black;
    }
  </style>
  