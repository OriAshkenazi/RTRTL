# Directional arrows and controls

Decide direction from meaning and the target product's convention. In this sample reading-order control, previous is on the right with a `→` icon and next is on the left with a `←` icon. That is a fixture-specific convention to verify, not a rule for every RTL interface. Keep physical axes, maps, coordinate systems, and diagram geometry in their physical directions. Do not infer that media, timeline, or transport controls should reverse.

Before testing, record each arrow’s meaning, expected physical direction, action and keyboard mapping. Decorative arrows carry no navigation promise; hide them from assistive technology when they convey no information. Do not infer keyboard behavior solely from icon direction.

Check the rendered result in the target application. Inspect arrow pixels after CSS/SVG/native automatic mirroring and all transforms; watch for accidental double-mirroring. Then check physical positions, accessible names, click actions, keyboard actions, and disabled states at both ends. Verify native exports separately when they are part of the deliverable. Source glyphs and computed transforms are useful evidence, but do not prove final SVG or pixel orientation.

For a simple Unicode reading-order fixture, confirm the expected glyphs and that no transform changes them, then inspect the rendered screenshots. Keep visual, position, accessibility, interaction, and export findings separate. Never apply a blanket RTL assumption to all arrows.
