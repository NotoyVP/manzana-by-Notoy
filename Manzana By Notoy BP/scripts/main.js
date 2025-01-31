import { world, system } from "@minecraft/server";
import { cargar } from "./manzana/notoy/db";
import { manzana } from "./manzana/notoy/configDef";
import { main } from "./manzana/notoy/manzana";

console.warn("la manzana anda con toyo. By Notoy :D. Comisiones al MD");

world.beforeEvents.chatSend.subscribe(e => {
    const admin = e.sender;
    const msg = e.message;

    if (msg == '!manzana' && admin.hasTag(manzana.config.tag)) {
        e.cancel = true;
        system.runTimeout(() => {
            main(admin);
        }, 40);
    }
});

function configManzana() {
    const configGuardado = cargar('manzanaConfig') || {};
    const efectosCombinados = { ...manzana.effectos };
    for (const efecto in configGuardado.effectos) {
        efectosCombinados[efecto] = { ...manzana.effectos[efecto], ...configGuardado.effectos[efecto] };
    }
    
    return {
        ...manzana,
        ...configGuardado,
        effectos: efectosCombinados,
        itemId: configGuardado.itemId || "minecraft:enchanted_golden_apple"
    };
}


world.afterEvents.itemCompleteUse.subscribe(e => {
    let player = e.source;
    let item = e.itemStack;
    const config = configManzana();

    
    // console.warn("Configuración cargada de manzana:", JSON.stringify(config));

    if (item.typeId == config.itemId) {
        for (const efe in config.effectos) {
            const efecto = config.effectos[efe];
            // console.warn("Efecto actual:", JSON.stringify(efecto));
            //eto era pa ver k tiraba undefine :vv
        
            if (efecto && typeof efecto.nombre === "string" && efecto.nombre.startsWith("minecraft:")) {
                player.addEffect(efecto.nombre, efecto.duracion, { amplifier: efecto.amplificador, showParticles: efecto.particulas });
            } else {
                // console.warn(`Nombre de efecto inválido o no definido: ${efecto?.nombre}`);
            }
        }
    }
});