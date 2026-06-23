import bpy
import os

root = os.path.dirname(os.path.abspath(__file__))
scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.studio_light = 'paint.sl'
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.show_shadows = True
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'WORLD'
scene.display.shading.curvature_ridge_factor = 1.4
scene.display.shading.curvature_valley_factor = 1.1
scene.display.shading.background_type = 'VIEWPORT'
scene.display.shading.background_color = (0.025, 0.035, 0.055)
scene.render.resolution_x = 1400
scene.render.resolution_y = 875
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.render.filepath = os.path.join(root, 'lamartiniere_school_preview.png')
bpy.ops.render.render(write_still=True)
