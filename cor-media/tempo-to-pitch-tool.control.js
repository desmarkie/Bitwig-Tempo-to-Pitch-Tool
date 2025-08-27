loadAPI(24);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("COR Media", "Tempo to Pitch Conversion", "0.1", "6b3fd9e4-9a47-49a1-b028-cca6e8825233", "Desmarkie");

function init() {

   function getTempoValue ( baseTempo, semitoneShift )
   {
      var inc = ( baseTempo/12.0 ) * semitoneShift;
      var newTempo = baseTempo * Math.pow(2, semitoneShift/12); //baseTempo + inc;
      return newTempo;
   }

   const documentState = host.getDocumentState();
   
   // Tempo Control
   const tempoControl = documentState.getNumberSetting("Audio Tempo", "Tempo_from_Pitch", 0, 1000, 0.01, "", 110.0);
   let curTempo = tempoControl.get() * 1000;

   // Store value slots in this array
   let semitones = [];

   // Add a button to update values
   documentState.getSignalSetting('Update Tempo Values', 'Tempo_from_Pitch', 'Update Tempo Values').addSignalObserver(() => {
      curTempo = tempoControl.get() * 1000;
      
      //positive changes
      for( let i = 1; i < 12; i++ )
      {
         let newTempo = getTempoValue( curTempo, -i );
         semitones[i-1].setRaw( newTempo );
      }

      //negative changes
      for( let i = 1; i < 12; i++ )
      {
         let newTempo = getTempoValue( curTempo, i );
         semitones[(i-1) + 11].setRaw( newTempo );
      }

   });
   
   // add the positive value slots
   for( let i = 1; i < 12; i++ )
   {
      semitones.push( documentState.getNumberSetting( "+"+i, "Tempo_from_Pitch", 0, 1000, 0.001, "", 0 ) );
   }

   // add the negative value slots
   for( let i = 1; i < 12; i++ )
   {
      semitones.push( documentState.getNumberSetting( "-"+i, "Tempo_from_Pitch", 0, 1000, 0.001, "", 0 ) );
   }

   println("Tempo to Pitch Tool Launched");

}


function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {
   println("Tempo to Pitch Tool Exited");
}
